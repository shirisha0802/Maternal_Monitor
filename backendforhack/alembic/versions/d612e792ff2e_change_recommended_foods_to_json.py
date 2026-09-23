"""change recommended foods to json

Revision ID: d612e792ff2e
Revises: 9ebe6b5ec7a1
Create Date: 2026-09-22 18:59:43.423282

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd612e792ff2e'
down_revision: Union[str, Sequence[str], None] = '9ebe6b5ec7a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'maternal_assessments',
        'recommended_foods',
        existing_type=sa.VARCHAR(),
        type_=sa.JSON(),
        postgresql_using="to_json(string_to_array(recommended_foods, ', '))",
        existing_nullable=False
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        'maternal_assessments',
        'recommended_foods',
        existing_type=sa.JSON(),
        type_=sa.VARCHAR(),
        existing_nullable=False
    )

    # ### end Alembic commands ###
